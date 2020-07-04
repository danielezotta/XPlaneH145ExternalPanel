# XPlaneH145ExternalPanel
Early version of an external MFD for the H145 in X-Plane

<img src="examples/preview1.jpg" alt="preview" width="400px"/>
<img src="examples/preview2.jpg" alt="preview" width="400px"/>

### Basic info
For now the application uses the XPlaneConnect plugin from NASA. You need to have that installed.
The communication between XPlane and the monitor is coded in Python 3.8, the monitor in HTML/CSS/Javascript.

### Support

The panel to run needs (currently) a Python 3.8 installation with all the needed modules. Moreover needs a client with
a browser that supports WebSockets (probably every browser since 2013).

### TODO

* MGB oil indicators correction
* bottom engine screen sub menus
* other screens than engine