
var mode = "prev";
var bottomMode = "prev";
var map;
var mapIcon;
var mapMarker;
var changedView = false;

function test() {
    setTimeout(function() {
        console.log("Test 1");
    }, 0);

    setTimeout(function() {
        console.log("Test 2");
        $("#screen_test img").attr('src', 'assets/images/panel_test_2.png');
    }, 3000);

    setTimeout(function() {
        console.log("Test 3");
        $("#screen_test img").attr('src', 'assets/images/panel_test_3.png');
    }, 6000);

    setTimeout(function() {
        console.log("Test 4");
        $("#screen_test").hide();
        $("#screen_commands").show();
        $("#screen_engine").show();

    }, 9000);
}

function setCurrentMode() {
    $(".MFD_option").on('click', function(event){
        switch (this.id) {
            case "vms_button":
                mode = "prev";
                $("#screen_engine").show();
                $("#screen_dmap").hide();
                break;
            case "dmap_button":
                mode = "dmap";
                $("#screen_engine").hide();
                $("#screen_dmap").show();
//                map.panTo([data.lat, data.lon]);
//                mapMarker.setLatLng([data.lat, data.lon]);
//                map.invalidateSize();
                break;
            case "weight_button":
                bottomMode = "weight";
                $("#screen_engine_bottom_prev").hide();
                $("#screen_engine_bottom_status").hide();
                $("#screen_engine_bottom_weight").show();
                break;
            case "prev_button":
                bottomMode = "prev";
                $("#screen_engine_bottom_weight").hide();
                $("#screen_engine_bottom_status").hide();
                $("#screen_engine_bottom_prev").show();
                break;
            case "status_button":
                bottomMode = "status";
                $("#screen_engine_bottom_prev").hide();
                $("#screen_engine_bottom_weight").hide();
                $("#screen_engine_bottom_status").show();
                break;
            default:
                mode = "prev";
                $("#screen_engine").show();
                $("#screen_dmap").hide();
        }
    });
}

function initMap(lat, lon) {
    map = L.map('dmap', {
        center: [10, 45],
        zoom: 16
    });
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    	maxZoom: 18,
    	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }).addTo(map);
    mapIcon = L.icon({
        iconUrl: 'assets/images/map_icon.png',
        iconSize: [50, 50],
        iconAnchor: [25, 25],
    });
    mapMarker = L.marker([lat, lon], {
        icon : mapIcon,
        keyboard : false
    });
    mapMarker.setLatLng([lat, lon]);
    mapMarker.setRotationOrigin('center center')
    mapMarker.addTo(map);
    map.invalidateSize();
}

function getArrowHolderIndicatorFor(x, y){
    var arrow_holder_vertices = [];
    arrow_holder_vertices.push(x + 0, y - 17);
    arrow_holder_vertices.push(x + 22, y - 17);
    arrow_holder_vertices.push(x + 40, y + 0);
    arrow_holder_vertices.push(x + 300, y + 0);
    arrow_holder_vertices.push(x + 40, y + 0);
    arrow_holder_vertices.push(x + 22, y + 17);
    arrow_holder_vertices.push(x + 0, y + 17);
    arrow_holder_vertices.push(x + 0, y + 13);
    arrow_holder_vertices.push(x + 20, y + 13);
    arrow_holder_vertices.push(x + 35, y + 0);
    arrow_holder_vertices.push(x + 22, y - 13);
    arrow_holder_vertices.push(x + 0, y - 13);
    return arrow_holder_vertices;
}

function getArrowIndicatorFor(x, y){
    var arrow_holder_vertices = [];
    arrow_holder_vertices.push(x + 0, y - 2);
    arrow_holder_vertices.push(x + 22, y - 2);
    arrow_holder_vertices.push(x + 22, y - 13);
    arrow_holder_vertices.push(x + 35, y - 0);
    arrow_holder_vertices.push(x + 300, y + 0);
    arrow_holder_vertices.push(x + 35, y - 0);
    arrow_holder_vertices.push(x + 22, y + 13);
    arrow_holder_vertices.push(x + 22, y + 2);
    arrow_holder_vertices.push(x + 0, y + 2);
    return arrow_holder_vertices;
}

function getSmallIndLeftVerticesFor(x, y) {
    var indicator_pointer_vertices = [];
    indicator_pointer_vertices.push(x + 0, y + 0);
    indicator_pointer_vertices.push(x + 25, y + 0);
    indicator_pointer_vertices.push(x + 0, y + 12);
    return indicator_pointer_vertices;
}

function getSmallIndRightVerticesFor(x, y) {
    var indicator_pointer_vertices = [];
    indicator_pointer_vertices.push(x + 0, y + 0);
    indicator_pointer_vertices.push(x + 25, y + 0);
    indicator_pointer_vertices.push(x + 25, y + 12);
    return indicator_pointer_vertices;
}

function getIndVerticesFor(x, y) {
    var indicator_pointer_vertices = [];
    indicator_pointer_vertices.push(x + 0, y + 5);
    indicator_pointer_vertices.push(x + 90, y + 0);
    indicator_pointer_vertices.push(x + 180, y + 0);
    indicator_pointer_vertices.push(x + 90, y + 0);
    indicator_pointer_vertices.push(x + 90, y + 15);
    indicator_pointer_vertices.push(x + 0, y + 10);
    return indicator_pointer_vertices;
}

function mapEgtAngle(egt) {
    return (egt * 0.002) - 3.141592;
}

function mapTrqAngle(trq) {
    return (trq * 0.021) - 3.926990;
}

function mapN1Angle(n1) {
    if (n1 > 80) {
        return (n1 * ( 0.0075 * (n1 * (1 + (n1 - 80)/25) / 80))) - 3.141592;
    } else {
        return (n1 * ( 0.0075 * (n1 / 80))) - 3.141592;
    }
}

function mapCenterFuelLevel(fuel) {
    return 115 * (fuel / 375);
}

function mapSideFuelLevel(fuel) {
    return 115 * (fuel / 188);
}

function mapN2Angle(n2) {
    return  ((n2 * 1.8) * 0.01745) -1.570796;
}

$(document).ready(function(){

    var init = true;
    var ip = "127.0.0.1";
    var port = 8081;
    test();

    $.getJSON("conf.json", function(data) {
        ip = data.ip;
        port = data.port;
    });

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        var ww = ( $(window).width() < window.screen.width ) ? $(window).width() : window.screen.width; //get proper width
        var mw = 1080; // min width of site
        var ratio =  ww / mw; //calculate ratio
        if (ww < mw){ //smaller than minimum size
            $('#viewport_meta').attr('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=yes, width=' + ww);
        } else { //regular size
            $('#viewport_meta').attr('content', 'initial-scale=1.0, maximum-scale=2, minimum-scale=1.0, user-scalable=yes, width=' + ww);
        }
    }

    //initMap(10, 45);
    var styles = {
      size: 34,
      family: 'Share'
    }

    var elem = document.getElementById('screen_engine_draw');
    var params = { width: 100, height: 100 };
    params.fullscreen = true;
    var two = new Two(params).appendTo(elem);

    var bottom_prev = document.getElementById('screen_engine_draw_bottom_prev');
    var bottom_prev_two = new Two(params).appendTo(bottom_prev);

    var fuel_vertices = [];
    fuel_vertices.push(195, 785);
    fuel_vertices.push(195, 875);
    fuel_vertices.push(215, 875);
    fuel_vertices.push(215, 900);
    fuel_vertices.push(245, 900);
    fuel_vertices.push(245, 815);
    fuel_vertices.push(255, 815);
    fuel_vertices.push(255, 900);
    fuel_vertices.push(375, 900);
    fuel_vertices.push(375, 815);
    fuel_vertices.push(385, 815);
    fuel_vertices.push(385, 900);
    fuel_vertices.push(400, 900);
    fuel_vertices.push(435, 900);
    fuel_vertices.push(435, 785);
    fuel_vertices.push(195, 785);

    var fuel_cover_vertices = [];
    fuel_cover_vertices.push(195, 875);
    fuel_cover_vertices.push(215, 875);
    fuel_cover_vertices.push(215, 900);
    fuel_cover_vertices.push(245, 900);
    fuel_cover_vertices.push(245, 815);
    fuel_cover_vertices.push(255, 815);
    fuel_cover_vertices.push(255, 900);
    fuel_cover_vertices.push(375, 900);
    fuel_cover_vertices.push(375, 815);
    fuel_cover_vertices.push(385, 815);
    fuel_cover_vertices.push(385, 900);
    fuel_cover_vertices.push(385, 925);
    fuel_cover_vertices.push(195, 925);

    var fuel_left_vertices = [];
    fuel_left_vertices.push(195, 785);
    fuel_left_vertices.push(195, 875);
    fuel_left_vertices.push(215, 875);
    fuel_left_vertices.push(215, 900);
    fuel_left_vertices.push(245, 900);
    fuel_left_vertices.push(245, 815);
    fuel_left_vertices.push(245, 785);
    fuel_left_vertices.push(195, 785);

    var fuel_center_vertices = [];
    fuel_center_vertices.push(245, 785);
    fuel_center_vertices.push(245, 815);
    fuel_center_vertices.push(255, 815);
    fuel_center_vertices.push(255, 900);
    fuel_center_vertices.push(375, 900);
    fuel_center_vertices.push(375, 815);
    fuel_center_vertices.push(385, 815);
    fuel_center_vertices.push(385, 785);

    var fuel_right_vertices = [];
    fuel_right_vertices.push(385, 815);
    fuel_right_vertices.push(385, 900);
    fuel_right_vertices.push(400, 900);
    fuel_right_vertices.push(435, 900);
    fuel_right_vertices.push(435, 785);
    fuel_right_vertices.push(385, 785);

    // two has convenience methods to create shapes.
    var egt1_arc = two.makeArcSegment(160, 330, 90, 95, -3.141592, 0);
    var egt2_arc = two.makeArcSegment(905, 330, 90, 95, -3.141592, 0);
    var n11_arc = two.makeArcSegment(400, 415, 90, 95, -3.141592, 0);
    var n12_arc = two.makeArcSegment(675, 415, 90, 95, -3.141592, 0);
    var trq1_arc = two.makeArcSegment(372, 192, 90, 95, -3.926990, 0);
    var trq2_arc = two.makeArcSegment(695, 192, 90, 95, -3.926990, 0);

    var fuel_left_indicator_container = two.makeRectangle(220, 843, 50, 115);
    var fuel_center_indicator_container = two.makeRectangle(315, 843, 140, 115);
    var fuel_right_indicator_container = two.makeRectangle(410, 843, 50, 115);
    var fuel_cover_indicator_container = two.makePath(...fuel_cover_vertices);
    var fuel_indicator_container = two.makePath(...fuel_vertices);
    var gen_1_circle = two.makeCircle(675, 780, 25);
    var gen_2_circle = two.makeCircle(955, 780, 25);
    var gen_1_text = two.makeText("G1", 675, 782, styles);
    var gen_2_text = two.makeText("G2", 955, 782, styles);

    var egt1_val = two.makeArcSegment(160, 330, 0, 90, -3.141592, -3.13);
    var egt2_val = two.makeArcSegment(905, 330, 0, 90, -3.141592, -3.13);
    var n11_val = two.makeArcSegment(400, 415, 0, 90, -3.141592, -3.13);
    var n12_val = two.makeArcSegment(675, 415, 0, 90, -3.141592, -3.13);
    var trq1_val = two.makeArcSegment(372, 192, 0, 90, -3.926990, -3.93);
    var trq2_val = two.makeArcSegment(695, 192, 0, 90, -3.926990, -3.93);

    var egt1_ind = two.makePath(...getIndVerticesFor(70, 320));
    var egt2_ind = two.makePath(...getIndVerticesFor(815, 320));
    var n11_ind = two.makePath(...getIndVerticesFor(310, 405));
    var n12_ind = two.makePath(...getIndVerticesFor(585, 405));
    var trq1_ind = two.makePath(...getIndVerticesFor(282, 182));
    var trq2_ind = two.makePath(...getIndVerticesFor(605, 182));

    var hyd1_ind = two.makePath(...getSmallIndLeftVerticesFor(125, 640));
    var hyd2_ind = two.makePath(...getSmallIndRightVerticesFor(202, 640));
    var eng1pre_ind = two.makePath(...getSmallIndRightVerticesFor(442, 640));
    var eng2pre_ind = two.makePath(...getSmallIndRightVerticesFor(682, 640));
    var eng1deg_ind = two.makePath(...getSmallIndLeftVerticesFor(370, 640));
    var eng2deg_ind = two.makePath(...getSmallIndLeftVerticesFor(610, 640));

    // The object returned has many stylable properties:
    trq1_ind.rotation = mapTrqAngle(0) - Math.PI;
    trq2_ind.rotation = mapTrqAngle(0) - Math.PI;

    egt1_arc.fill = 'rgba(249, 215, 28, 0.9)';
    egt2_arc.fill = 'rgba(249, 215, 28, 0.9)';
    n11_arc.fill = 'rgba(249, 215, 28, 0.9)';
    n12_arc.fill = 'rgba(249, 215, 28, 0.9)';
    trq1_arc.fill = 'rgba(249, 215, 28, 0.9)';
    trq2_arc.fill = 'rgba(249, 215, 28, 0.9)';

    egt1_ind.noStroke();
    egt2_ind.noStroke();
    n11_ind.noStroke();
    n12_ind.noStroke();
    trq1_ind.noStroke();
    trq2_ind.noStroke();

    egt1_ind.fill = 'rgba(249, 215, 28, 0.9)';
    egt2_ind.fill = 'rgba(249, 215, 28, 0.9)';
    n11_ind.fill = 'rgba(249, 215, 28, 0.9)';
    n12_ind.fill = 'rgba(249, 215, 28, 0.9)';
    trq1_ind.fill = 'rgba(249, 215, 28, 0.9)';
    trq2_ind.fill = 'rgba(249, 215, 28, 0.9)';

    hyd1_ind.fill = 'rgba(249, 215, 28, 0.9)';
    hyd2_ind.fill = 'rgba(249, 215, 28, 0.9)';
    eng1pre_ind.fill = 'rgba(249, 215, 28, 0.9)';
    eng2pre_ind.fill = 'rgba(249, 215, 28, 0.9)';
    eng1deg_ind.fill = 'rgba(249, 215, 28, 0.9)';
    eng2deg_ind.fill = 'rgba(249, 215, 28, 0.9)';

    egt1_val.fill = 'rgba(249, 215, 28, 0.5)';
    egt2_val.fill = 'rgba(249, 215, 28, 0.5)';
    n11_val.fill = 'rgba(249, 215, 28, 0.5)';
    n12_val.fill = 'rgba(249, 215, 28, 0.5)';
    trq1_val.fill = 'rgba(249, 215, 28, 0.5)';
    trq2_val.fill = 'rgba(249, 215, 28, 0.5)';

    gen_1_circle.stroke = 'rgba(255, 255, 255, 0.9)';
    gen_1_circle.linewidth = 5;
    gen_1_circle.noFill();

    gen_2_circle.stroke = 'rgba(255, 255, 255, 0.9)';
    gen_2_circle.linewidth = 5;
    gen_2_circle.noFill();

    gen_1_text.fill = 'rgba(255, 255, 255, 0.9)';

    gen_2_text.fill = 'rgba(255, 255, 255, 0.9)';

    fuel_cover_indicator_container.fill = '#0c0c0c';
    fuel_cover_indicator_container.stroke = '#0c0c0c';

    fuel_indicator_container.noFill();
    fuel_indicator_container.stroke = 'white';
    fuel_indicator_container.linewidth = 5;

    fuel_left_indicator_container.fill = 'rgba(50, 88, 200, 0.75)';
    fuel_left_indicator_container.noStroke();

    fuel_center_indicator_container.fill = 'rgba(50, 88, 200, 0.75)';
    fuel_center_indicator_container.noStroke();

    fuel_right_indicator_container.fill = 'rgba(50, 88, 200, 0.75)';
    fuel_right_indicator_container.noStroke();

    two.update();

    var n21_arc = bottom_prev_two.makeArcSegment(830, 1130, 0, 75, -4.71239, -4.72);
    var n22_arc = bottom_prev_two.makeArcSegment(830, 1130, 0, 75, -4.71239, -4.71);
    var prev_bottom_n2 = bottom_prev_two.makeArcSegment(830, 1130, 100, 105, -4.712388, 0);
    var prev_bottom_line = bottom_prev_two.makeLine(605, 965, 605, 1375);
    var n21_ind = bottom_prev_two.makePath(...getIndVerticesFor(740, 1120));
    var n22_ind = bottom_prev_two.makePath(...getIndVerticesFor(740, 1120));
    var n21_holder = bottom_prev_two.makePath(...getArrowHolderIndicatorFor(680, 1130));
    var n22_arrow = bottom_prev_two.makePath(...getArrowIndicatorFor(680, 1130));

    n21_arc.fill = 'rgba(255, 255, 255, 0.25)';
    n22_arc.fill = 'rgba(255, 255, 255, 0.25)';

    n21_ind.scale = 1.05;
    n22_ind.scale = 1.05;

    n21_ind.fill = 'rgba(249, 215, 28, 0.5)';
    n22_ind.fill = 'rgba(249, 215, 28, 0.5)';

    n21_ind.noStroke();
    n22_ind.noStroke();

    n21_holder.fill = 'rgba(249, 215, 28, 0.5)';
    n22_arrow.fill = 'rgba(249, 215, 28, 0.5)';

    n21_holder.noStroke();
    n22_arrow.noStroke();

    n21_ind.rotation = mapN2Angle(0);
    n22_ind.rotation = mapN2Angle(0);

    n21_holder.rotation = mapN2Angle(0);
    n22_arrow.rotation = mapN2Angle(0);

    prev_bottom_line.stroke = 'white';
    prev_bottom_line.linewidth = 5;

    bottom_prev_two.update();

    setTimeout(function() {

        $(".indicator").addClass("indicator_loaded");
        $(".indicator").removeClass("indicator_loading");

        egt1_arc.fill = 'rgba(255, 255, 255, 0.9)';
        egt2_arc.fill = 'rgba(255, 255, 255, 0.9)';
        n11_arc.fill = 'rgba(255, 255, 255, 0.9)';
        n12_arc.fill = 'rgba(255, 255, 255, 0.9)';
        trq1_arc.fill = 'rgba(255, 255, 255, 0.9)';
        trq2_arc.fill = 'rgba(255, 255, 255, 0.9)';

        egt1_ind.fill = 'rgba(255, 255, 255, 0.9)';
        egt2_ind.fill = 'rgba(255, 255, 255, 0.9)';
        n11_ind.fill = 'rgba(255, 255, 255, 0.9)';
        n12_ind.fill = 'rgba(255, 255, 255, 0.9)';
        trq1_ind.fill = 'rgba(255, 255, 255, 0.9)';
        trq2_ind.fill = 'rgba(255, 255, 255, 0.9)';

        hyd1_ind.fill = 'rgba(255, 255, 255, 0.9)';
        hyd2_ind.fill = 'rgba(255, 255, 255, 0.9)';
        eng1pre_ind.fill = 'rgba(255, 255, 255, 0.9)';
        eng2pre_ind.fill = 'rgba(255, 255, 255, 0.9)';
        eng1deg_ind.fill = 'rgba(255, 255, 255, 0.9)';
        eng2deg_ind.fill = 'rgba(255, 255, 255, 0.9)';

        egt1_val.fill = 'rgba(255, 255, 255, 0.5)';
        egt2_val.fill = 'rgba(255, 255, 255, 0.5)';
        n11_val.fill = 'rgba(255, 255, 255, 0.5)';
        n12_val.fill = 'rgba(255, 255, 255, 0.5)';
        trq1_val.fill = 'rgba(255, 255, 255, 0.5)';
        trq2_val.fill = 'rgba(255, 255, 255, 0.5)';

        two.update();

        n21_ind.fill = 'rgba(255, 255, 255, 0.5)';
        n22_ind.fill = 'rgba(255, 255, 255, 0.5)';

        n21_holder.fill = 'rgba(255, 255, 255, 0.9)';
        n22_arrow.fill = 'rgba(255, 255, 255, 0.9)';

        bottom_prev_two.update();

        // setInterval(function() {
        setCurrentMode();
        websocket = new WebSocket('ws://' + ip + ':' + port);
        websocket.onmessage = function(event) {
          if (event.data.length > 10) {
            var data = JSON.parse(event.data);
            console.log(data);
            $("#eng1_n1").text(data.n1_1 + " %");
            $("#eng2_n1").text(data.n1_2 + " %");
            $("#eng1_egt").text(data.egt_1 + " °C");
            $("#eng2_egt").text(data.egt_2 + " °C");
            $("#eng1_trq").html("<p>" + data.trq_1 + " %</p>");
            $("#eng2_trq").html("<p>" + data.trq_2 + " %</p>");
            $("#fuel_left").text(data.fuel_0);
            $("#fuel_center").text(data.fuel_1);
            $("#fuel_right").text(data.fuel_2);
            $("#hyd_1").text(data.hyd_1);
            $("#hyd_2").text(data.hyd_2);
            $("#oilp_1").text(data.oilpress_1);
            $("#oilp_2").text(data.oilpress_2);
            $("#fuel_ff_0").text(data.fuelf_0);
            $("#fuel_ff_1").text(data.fuelf_1);
            $("#gen1_amp").text(data.genamps_1);
            $("#gen2_amp").text(data.genamps_2);
            $("#bat_volt").text(data.bat);
            $("#mgb_temp").text(data.mgb_t);
            $("#mgb_press").text(data.mgb_p);

            if (data.trq_1 > 109) {
                trq1_val.fill = 'rgba(255, 25, 25, 0.5)';
            } else if (data.trq_1 > 97) {
                trq1_val.fill = 'rgba(249, 215, 28, 0.5)';
            } else {
                trq1_val.fill = 'rgba(255, 255, 255, 0.5)';
            }

            if (data.trq_2 > 109) {
                trq2_val.fill = 'rgba(255, 25, 25, 0.5)';
            } else if (data.trq_2 > 97) {
                trq2_val.fill = 'rgba(249, 215, 28, 0.5)';
            } else {
                trq2_val.fill = 'rgba(255, 255, 255, 0.5)';
            }

            if (data.n1_1 > 100) {
                n11_val.fill = 'rgba(255, 25, 25, 0.5)';
            } else if (data.n1_1 > 97) {
                n11_val.fill = 'rgba(249, 215, 28, 0.5)';
            } else {
                n11_val.fill = 'rgba(255, 255, 255, 0.5)';
            }

            if (data.n1_2 > 100) {
                n12_val.fill = 'rgba(255, 25, 25, 0.5)';
            } else if (data.n1_1 > 97) {
                n12_val.fill = 'rgba(249, 215, 28, 0.5)';
            } else {
                n12_val.fill = 'rgba(255, 255, 255, 0.5)';
            }

            egt1_ind.rotation = mapEgtAngle(data.egt_1) - Math.PI;
            egt2_ind.rotation = mapEgtAngle(data.egt_2) - Math.PI;
            n11_ind.rotation = mapN1Angle(data.n1_1) - Math.PI;
            n12_ind.rotation = mapN1Angle(data.n1_2) - Math.PI;
            trq1_ind.rotation = mapTrqAngle(data.trq_1) - Math.PI;
            trq2_ind.rotation = mapTrqAngle(data.trq_2) - Math.PI;

            n11_val.endAngle = mapN1Angle(data.n1_1);
            n12_val.endAngle = mapN1Angle(data.n1_2);
            egt1_val.endAngle = mapEgtAngle(data.egt_1);
            egt2_val.endAngle = mapEgtAngle(data.egt_2);
            trq1_val.endAngle = mapTrqAngle(data.trq_1);
            trq2_val.endAngle = mapTrqAngle(data.trq_2);

            hyd1_ind.translation.y = 640 - (data.hyd_1 * 50);
            hyd2_ind.translation.y = 640 - (data.hyd_2 * 50);
            eng1pre_ind.translation.y = 640 - (data.oilpress_1 / 90 * 50);
            eng2pre_ind.translation.y = 640 - (data.oilpress_2 / 90 * 50);
            eng1deg_ind.translation.y = 640 - (data.oiltemp_1);
            eng2deg_ind.translation.y = 640 - (data.oiltemp_2);

            fuel_left_indicator_container.height = mapSideFuelLevel(data.fuel_0);
            fuel_left_indicator_container.origin.y = (115 - mapSideFuelLevel(data.fuel_0)) / 2;
            fuel_center_indicator_container.height = mapCenterFuelLevel(data.fuel_1);
            fuel_center_indicator_container.origin.y = (115 - mapCenterFuelLevel(data.fuel_1)) / 2;
            fuel_right_indicator_container.height = mapSideFuelLevel(data.fuel_2);
            fuel_right_indicator_container.origin.y = (115 - mapSideFuelLevel(data.fuel_2)) / 2;

            if (data.gen_1 == 1) {
              gen_1_text.fill = 'rgba(154, 255, 0, 0.9)';
              gen_1_circle.stroke = 'rgba(154, 255, 0, 0.9)';
            } else {
              gen_1_text.fill = 'rgba(255, 255, 255, 0.9)';
              gen_1_circle.stroke = 'rgba(255, 255, 255, 0.9)';
            }

            if (data.gen_2 == 1) {
              gen_2_text.fill = 'rgba(154, 255, 0, 0.9)';
              gen_2_circle.stroke = 'rgba(154, 255, 0, 0.9)';
            } else {
              gen_2_text.fill = 'rgba(255, 255, 255, 0.9)';
              gen_2_circle.stroke = 'rgba(255, 255, 255, 0.9)';
            }

            two.update();

            if (init == true) {
                init = false;
                initMap(data.lat, data.lon);
            }

            if (mode == "dmap") {
                map.panTo([data.lat, data.lon]);
                mapMarker.setLatLng([data.lat, data.lon]);
                mapMarker.setRotationAngle(data.hdg);
                map.invalidateSize();
            } else if (mode == "prev") {
                if (bottomMode == "prev") {
                    $("#prev_total_weight").text(data.weight + " KG");
                    $("#prev_n2_1").text(data.n2_1 + " %");
                    $("#prev_n2_2").text(data.n2_2 + " %");
                    $("#prev_n2").text(data.n2_1);
                    n21_arc.endAngle = mapN2Angle(data.n2_1)-3.14;
                    n22_arc.endAngle = mapN2Angle(data.n2_2)-3.14;
                    n21_ind.rotation = mapN2Angle(data.n2_1);
                    n22_ind.rotation = mapN2Angle(data.n2_2);
                    n21_holder.rotation = mapN2Angle(data.n2_1);
                    n22_arrow.rotation = mapN2Angle(data.n2_2);
                    bottom_prev_two.update();
                } else if (bottomMode == "weight") {
                    $("#weight_total_weight").text(data.weight + " KG");
                    $("#weight_fuel_total").text(data.fuel_t + " KG");
                    $("#weight_total_payload").text(data.weight_p + " KG");
                    $("#weight_total_empty").text(data.weight_e + " KG");
                } else if (bottomMode == "status") {
                    $("#status_n2_1").html(data.n2_1 + " <span class='opacity-50'>%</span>");
                    $("#status_n2_2").html(data.n2_2 + " <span class='opacity-50'>%</span>");
                    $("#status_pressure_1").html(data.pressure + " <span class='opacity-50'>hPa</span>");
                    $("#status_pressure_2").html(data.pressure + " <span class='opacity-50'>hPa</span>");
                    $("#status_temperature_1").html(data.temperature + " <span class='opacity-50'>°C</span>");
                    $("#status_temperature_2").html(data.temperature + " <span class='opacity-50'>°C</span>");
                }
            }

          }
        }

    }, 12000);
});
