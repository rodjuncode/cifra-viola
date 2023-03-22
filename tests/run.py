import platform
import base64
import cv2
import numpy as np
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

__appURL = 'http://localhost:5500/src/'
__testClass = 'ArtTest.js'
__fullHdRes = 'window-size=1920,1080'
__hdRes = 'window-size=1366,768'
__napTime = 2
__saveArtWork = False
__maxMSE = 15
__logs = []


def fetchBrowserLogs(browser):
    l = browser.get_log('browser')
    if (len(l) > 0):
        __logs.extend(l)


def getBrowserLogs():
    return __logs


def fetchCanvasAsPng(browser):
    canvas = browser.find_element(By.ID, "defaultCanvas0")
    canvas_base64 = browser.execute_script(
        "return arguments[0].toDataURL('image/png').substring(22);", canvas)
    canvas_png = base64.b64decode(canvas_base64)
    return canvas_png


def getThenNap(browser, url, sleep):
    browser.get(url)
    time.sleep(sleep)


def getThenWaitReady(browser, url):
    browser.get(url)
    isNotReady = True
    while (isNotReady):
        for entry in browser.get_log('browser'):
            if ('[' + __testClass + ']:ready' in entry['message']):
                isNotReady = False
                break


# select proper OS chrome driver
if (platform.system() == 'Windows'):
    driverVersion = 'win32.exe'
elif (platform.system() == 'Linux'):
    driverVersion = 'linux64'
elif (platform.system() == 'Darwin'):
    driverVersion = 'mac64'
else:
    print("[FATAL] Sorry, we couldn't find the correct chromedriver version for the current platform: " + platform.system() + ".")
    print("Please check: https://chromedriver.chromium.org/downloads")
    print("Exiting now.")
    exit()

# setup chrome options
chrome_options = {'primary': Options(), 'secondary': Options()}

chrome_options['primary'].add_argument("--headless")
chrome_options['primary'].add_argument("--no-sandbox")
chrome_options['primary'].add_experimental_option(
    'excludeSwitches', ['enable-logging'])
chrome_options['primary'].add_argument(__fullHdRes)

chrome_options['secondary'].add_argument("--headless")
chrome_options['secondary'].add_argument("--no-sandbox")
chrome_options['secondary'].add_experimental_option(
    'excludeSwitches', ['enable-logging'])
chrome_options['secondary'].add_argument(__hdRes)

webdriver_service = Service(f"../drivers/chromedriver_" + driverVersion)

d = DesiredCapabilities.CHROME
d['goog:loggingPrefs'] = {'browser': 'ALL'}

browser = {'primary': webdriver.Chrome(
    service=webdriver_service, options=chrome_options['primary'], desired_capabilities=d),
    'secondary': webdriver.Chrome(
    service=webdriver_service, options=chrome_options['secondary'], desired_capabilities=d),
}

# start tests
continueGenerating = True
generated = 0

while (continueGenerating):

    # 0. fetch important info
    getThenNap(browser['primary'],
               __appURL, 0)
    info = dict()
    fetchBrowserLogs(browser['primary'])
    for entry in getBrowserLogs():
        if ('[' + __testClass + ']:hash' in entry['message']):
            info['hash'] = entry['message'].split()[3].strip('\"')

    # 1. simple determinancy test
    getThenWaitReady(browser['primary'],
                     __appURL + '?hash=' +
                     info['hash'])
    png1 = fetchCanvasAsPng(browser['primary'])

    getThenWaitReady(browser['primary'], __appURL + '?hash=' +
                     info['hash'])
    png2 = fetchCanvasAsPng(browser['primary'])

    img1 = cv2.imdecode(np.frombuffer(png1, np.uint8), cv2.IMREAD_COLOR)
    img2 = cv2.imdecode(np.frombuffer(png2, np.uint8), cv2.IMREAD_COLOR)

    if (img1.shape != img2.shape):
        continueGenerating = False

    difference = cv2.subtract(img1, img2)
    b, g, r = cv2.split(difference)
    if cv2.countNonZero(b) != 0 or cv2.countNonZero(g) != 0 or cv2.countNonZero(r) != 0:
        continueGenerating = False

    if (continueGenerating == False):
        print('Failed comparing two canvas captures from the same hash, with the same size: ' +
              info['hash'] + '. Please resolve.')
        break

    # 2. determinancy test after resizing browser window
    getThenWaitReady(browser['secondary'], __appURL + '?hash=' +
                     info['hash'])
    png2 = fetchCanvasAsPng(browser['secondary'])
    img2 = cv2.imdecode(np.frombuffer(png2, np.uint8), cv2.IMREAD_COLOR)

    dim = (img2.shape[1], img2.shape[0])

    getThenWaitReady(browser['primary'],
                     __appURL + '?hash=' +
                     info['hash'])
    png1 = fetchCanvasAsPng(browser['primary'])
    # resize image
    img1 = cv2.resize(cv2.imdecode(np.frombuffer(png1, np.uint8),
                      cv2.IMREAD_COLOR), dim, interpolation=cv2.INTER_AREA)

    if (img1.shape != img2.shape):
        continueGenerating = False

    difference = cv2.subtract(img1, img2)
    err = np.sum(difference**2)
    mse = err/(float(img2.shape[1]*img2.shape[0]))

    if (mse > __maxMSE):
        continueGenerating = False
        print('Failed comparing two canvas captures from the same hash, after resizing (mse = ' + str(mse) + '): ' +
              info['hash'] + '. Please resolve.')
        break

    generated = generated + 1
    print('Generated & tested: ' + info['hash'])
