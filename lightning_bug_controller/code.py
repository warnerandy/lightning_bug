# SPDX-FileCopyrightText: 2022 Liz Clark for Adafruit Industries
#
# SPDX-License-Identifier: MIT

import os
import ipaddress
import wifi
import socketpool
import mdns
import time
import board
import neopixel
import json

from CustomColorPatternFill import CustomColorPatternFill

from adafruit_led_animation.animation.multicolor_comet import MulticolorComet
from adafruit_led_animation.color import GREEN, RED, BLUE, BLACK, OLD_LACE, WHITE

from adafruit_httpserver import Server, Request, JSONResponse, REQUEST_HANDLED_RESPONSE_SENT, POST

print()
print("Connecting to WiFi")

#  connect to your SSID
wifi.radio.connect(os.getenv('WIFI_SSID'), os.getenv('WIFI_PASSWORD'))
pool = socketpool.SocketPool(wifi.radio)

mdns_server = mdns.Server(wifi.radio)
mdns_server.hostname = "lightning-bug"
mdns_server.instance_name= "LED Lights Controller"
mdns_server.advertise_service(service_type="_http", protocol="_tcp", port=80)

PIXEL_PIN = board.GP27
mdns_ticks = 0

num_pixels = 100
method = "rotate"
speed = .5
size = 2
colors = [RED,GREEN,BLUE]
brightness = .3
customPixels = []
chase = None

def load():
    with open("/lights.txt","r") as fp:
        try:
            pix = json.loads(fp.read())
            return pix
        except:
            return False

saved_defaults = load()
if isinstance(saved_defaults, dict):
    num_pixels = saved_defaults.get("total")
    if num_pixels is None:
        num_pixels = 100
    brightness = saved_defaults.get("brightness")
    if brightness is None:
        brightness = .2

    method = saved_defaults.get("method")
    if method is None:
        method = "rotate"
    customPixels = saved_defaults.get("pixels")
    
    speed = saved_defaults.get("speed")
    if speed is None:
        speed = .5
    size = saved_defaults.get("size")
    if size is None:
        size = 2
    colors = saved_defaults.get("colors")
    if colors is None:
        colors = [RED, GREEN, BLUE]



ORDER = neopixel.RGB
pixels = neopixel.NeoPixel(
    PIXEL_PIN, num_pixels, brightness=brightness, auto_write=False, pixel_order=ORDER
)
if method == "rotate" and speed != 0: 
    print(speed)
    chase = CustomColorPatternFill(pixels, speed=speed, size=size, colors=colors)

server = Server(pool, "/static", debug=True)

@server.route("/")
def base(request: Request):
   return JSONResponse(request, load())

@server.route("/update", POST)
def update(request: Request):
    global pixels
    global speed
    global method
    global num_pixels
    global brightness
    global colors
    global size
    global customPixels
    global chase
    try:
        jsonRequest = request.json()

        num_pixels = jsonRequest.get("total")
        brightness = jsonRequest.get("brightness")

        method = jsonRequest.get("method")
        customPixels = jsonRequest.get("pixels")

        speed = jsonRequest.get("speed")
        colors = jsonRequest.get("colors")
        size = jsonRequest.get("size")
        
        pixels.deinit()
        pixels = neopixel.NeoPixel(PIXEL_PIN, num_pixels, brightness=brightness, auto_write=False, pixel_order=ORDER)

        if method == "rotate":
            chase = CustomColorPatternFill(pixels, speed=speed, size=size, colors=colors)
            chase.animate()
        
        save(jsonRequest)
    except Exception as e:
        print(e)
    return JSONResponse(request, {"test","again"})

# Start the server.
server.start(str(wifi.radio.ipv4_address))

def setPixels():
    global pixels
    global customPixels
    for idx, pixel in enumerate(customPixels):
        pixels[idx] = pixel
    
def save(pixelObj):
    with open("/lights.txt", "w") as fp:
        fp.write(json.dumps(pixelObj))
        fp.flush()

while True:
    try:
        if method == "rotate" and speed != 0 and chase is not None:
            chase.animate()
        elif method == "spotlight":
            setPixels()
            pizels.show()
        elif method == "clear":
            pixels.fill(BLACK)
        mdns_ticks += 1
        if mdns_ticks == 9000:
            mdns_ticks = 0
            mdns_server.advertise_service(service_type="_http", protocol="_tcp", port=80)
        if time.monotonic() > 3600:
            microcontroller.reset()
        # Process any waiting requests
        try:
            pool_result = server.poll()
        except Exception as error:
            print(error)
            continue
        # time.sleep(.03)
        # If you want you can stop the server by calling server.stop() anywhere in your code
    except OSError as error:
        print(error)
        print(chase)
        continue


