#!/usr/bin/env python

# windows : pyinstaller -F dataReceiver.py --noupx --hidden-import graphics --hidden-import websockets --noconsole

import xpc
import json
import socket
import http.server
import webbrowser
import threading
import asyncio
import websockets
import graphics
import time
import types

app = types.SimpleNamespace()
app.name = "H145 panel"
app.connected_to_xplane = False
app.ip_address = "127.0.0.1"
app.http_port = 8080
app.ws_port = 8081


def check_xplane_connection():
    while True:
        print("Trying to connect to X-Plane...")
        client = xpc.XPlaneConnect()
        try:
            # If X-Plane does not respond to the request, a timeout error
            # will be raised.
            client.getDREF("sim/test/test_float")
            #
            app.connected_to_xplane = True
            return
        except:
            print("Error establishing connection to X-Plane.")
            print("Retrying...")
        time.sleep(10)


def window_connecting():

    win = graphics.GraphWin('H145 External Panel', 350, 350)  # give title and dimensions
    # make right side up coordinates!

    xplane = graphics.Text(graphics.Point(60, 20), 'X-Plane 11 : ')
    connected_message = 'Not connected'
    connected = graphics.Text(graphics.Point(160, 20), connected_message)
    connected.setTextColor('red')
    xplane.draw(win)
    connected.draw(win)

    check_xplane_connection()

    win.close()
    window_connected()


def window_connected():

    win = graphics.GraphWin('H145 External Panel', 350, 350)  # give title and dimensions

    xplane = graphics.Text(graphics.Point(60, 20), 'X-Plane 11 : ')
    connected_message = 'Connected'
    connected = graphics.Text(graphics.Point(160, 20), connected_message)
    connected.setTextColor('green')
    xplane.draw(win)
    connected.draw(win)

    open_browser = graphics.Text(graphics.Point(win.getWidth() / 2, 100), 'Open in browser\n\nor')
    open_browser.draw(win)

    open_device = graphics.Text(graphics.Point(win.getWidth() / 2, 180),
                                "digit the following into a web browser :\n\n http://" + str(app.ip_address) + ":" + str(
                                    app.http_port) + "/app/")
    open_device.draw(win)

    while app.connected_to_xplane:
        point = win.getMouse()
        if 110 < point.getX() < 240 and 70 < point.getY() < 95:
            url = "http://" + str(app.ip_address) + ":" + str(app.http_port) + "/app/index.html"
            webbrowser.open(url, new=2)

    win.close()
    window_connecting()


async def send_data(websocket, path):

    print("Connection to X-Plane", flush=True)

    while not app.connected_to_xplane:
        await asyncio.sleep(1)

    client1 = xpc.XPlaneConnect()

    grossWt = "sim/flightmodel/weight/m_total"
    totalFuel = "sim/flightmodel/weight/m_fuel_total"
    egt = "sim/flightmodel2/engines/ITT_deg_C"
    n1 = "sim/cockpit2/engine/indicators/N1_percent"
    n2 = "sim/cockpit2/engine/indicators/N2_percent"
    tq = "sim/cockpit2/engine/indicators/torque_n_mtr"
    oilPress = "sim/cockpit2/engine/indicators/oil_pressure_psi"
    fuelTanks = "sim/flightmodel/weight/m_fuel"
    fuelFlow = "sim/cockpit2/engine/indicators/fuel_flow_kg_sec"
    oilTemp = "sim/cockpit2/engine/indicators/oil_temperature_deg_C"
    oilQty = "sim/flightmodel/engine/ENGN_oil_quan"
    lat = "sim/flightmodel/position/latitude"
    lon = "sim/flightmodel/position/longitude"
    hdg = "sim/flightmodel/position/true_psi"
    hyd1 = "sim/cockpit2/hydraulics/indicators/hydraulic_pressure_1"
    hyd2 = "sim/cockpit2/hydraulics/indicators/hydraulic_pressure_2"
    gen = "sim/cockpit2/electrical/generator_amps"
    genOn = "sim/cockpit/electrical/generator_on"
    bat = "sim/cockpit2/electrical/battery_voltage_actual_volts"
    mgbPress = "sim/flightmodel/transmissions/xmsn_press"
    mgbTemp = "sim/flightmodel/transmissions/xmsn_temp"
    payload = "sim/flightmodel/weight/m_fixed"
    pressure = "sim/weather/barometer_current_inhg"
    temperature = "sim/weather/temperature_ambient_c"

    while True:
        values = dict()
        try:

            res = client1.getDREFs([egt, n1, n2, tq, fuelTanks, fuelFlow, oilTemp, oilPress, oilQty, lat, lon, hyd1, hyd2, genOn, gen, bat, mgbTemp, mgbPress, hdg, grossWt, totalFuel, payload, pressure, temperature])

            values["egt_1"] = round(res[0][0], 0)
            values["egt_2"] = round(res[0][1], 0)
            values["n1_1"] = "{:.1f}".format(round(res[1][0], 1))
            values["n1_2"] = "{:.1f}".format(round(res[1][1], 1))
            values["n2_1"] = "{:.1f}".format(abs(round(res[2][0], 1)))
            values["n2_2"] = "{:.1f}".format(abs(round(res[2][1], 1)))
            values["trq_1"] = "{:.1f}".format(abs(round(res[3][0]/118.5, 1)))
            values["trq_2"] = "{:.1f}".format(abs(round(res[3][1]/118.5, 1)))
            values["fuel_0"] = round(res[4][0] / 2, 0)
            values["fuel_1"] = round(res[4][1], 0)
            values["fuel_2"] = round(res[4][0] / 2, 0)
            values["fuelf_0"] = round(res[5][0] * 3600 / 2, 0)
            values["fuelf_1"] = round(res[5][1] * 3600 / 2, 0)
            values["oiltemp_1"] = "{:.1f}".format(round(res[6][0], 1))
            values["oiltemp_2"] = "{:.1f}".format(round(res[6][1], 1))
            values["oilpress_1"] = round(res[7][0], 1)
            values["oilpress_2"] = round(res[7][1], 1)
            values["oil_1"] = round(res[8][0], 1)
            values["oil_2"] = round(res[8][1], 1)
            values["lat"] = round(res[9][0], 4)
            values["lon"] = round(res[10][0], 4)
            values["hyd_1"] = round(res[11][0], 2)
            values["hyd_2"] = round(res[12][0], 2)
            values["gen_1"] = res[13][0]
            values["gen_2"] = res[13][1]
            values["genamps_1"] = "{:.1f}".format(round(res[14][0], 1))
            values["genamps_2"] = "{:.1f}".format(round(res[14][1], 1))
            values["bat"] = "{:.1f}".format(round(res[15][0], 1))
            values["mgb_t"] = "{:.1f}".format(round(res[16][0], 1))
            values["mgb_p"] = "{:.1f}".format(round(res[17][0], 1))
            values["hdg"] = "{:0>3.0f}".format(round(res[18][0], 0))
            values["weight"] = round(res[19][0], 0)
            values["fuel_t"] = round(res[20][0], 0)
            values["weight_p"] = round(res[21][0], 0)
            values["weight_e"] = round(res[19][0] - res[20][0] - res[21][0], 0)
            values["pressure"] = "{:.2f}".format(res[22][0])
            values["temperature"] = "{:.1f}".format(res[23][0])

        except ValueError:

            print("ValueError, reconnecting to X-Plane")
            values = {}
        except socket.timeout:
            print("Socket timeout")
            values = {}

        except Exception as inst:
            print(type(inst))
            print(inst.args)
            #client = xpc.XPlaneConnect()

            continue
        
        json_val = json.dumps(values)
        await websocket.send(json_val)
        await asyncio.sleep(0.10)


def main():

    app.connected_to_xplane = False

    app.ip_address = socket.gethostbyname(socket.gethostname())

    print("H145panel connecting to sim")

    f_conf = open("app/conf.json", "w")
    json.dump({"ip": app.ip_address, "port": app.ws_port}, f_conf)
    f_conf.close()

    print("computer address %s" % app.ip_address)

    handler = http.server.SimpleHTTPRequestHandler
    httpd = http.server.socketserver.TCPServer(("", app.http_port), handler)
    print("serving at port", app.http_port)

    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    start_server = websockets.serve(send_data, app.ip_address, app.ws_port)
    asyncio.get_event_loop().run_until_complete(start_server)
    threading.Thread(target=asyncio.get_event_loop().run_forever, daemon=True).start()

    window_connecting()


if __name__ == "__main__":
    main()
