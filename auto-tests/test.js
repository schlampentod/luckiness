'use strict';

const log4js = require('log4js');
log4js.setGlobalLogLevel('ALL');

require("./format/ResponseFormatTest");

// require("./canonical/CanonicalDemoTest");
// require("./canonical/ObservationSubmitTest");
// require("./canonical/ObservationListTest");
// require("./canonical/CanonicalNodeListTest");
// require("./canonical/CanonicalNodeTriangulationTest");
// require("./canonical/ObservationBtTest");
// require("./canonical/ObservationCellTest");

require("./auth/AuthTest");
require("./auth/SignUpTest");
require("./auth/LoginTest");
require("./auth/SignUpTest");

