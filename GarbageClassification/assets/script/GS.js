import EventListener from './common/event_listener';

cc.log('load GS');
window.GS = {};
GS.Constant = require('./code/GSConstants.js');
GS.Utils = require('./code/GSUtils.js');
GS.Log = require('./code/GSLog.js'); 
GS.GLOG = GS.Log.GLOG; // 全局日志
GS.Http = require('./code/GSHttp.js');
GS.NotificationCenter = require('./code/GSNotificationCenter.js');
GS.KVStorage = require('./code/GSKVStorage.js');
GS.Random = require('./code/GSRandom.js');
GS.Math = require('./code/GSMath.js');
GS.AudioManager = require('./code/GSAudioManager.js');
GS.Extersion = require('./code/GSExtension.js');
GS.LZString = require('./third/lz-string.js');
GS.FSM = require('./third/state-machine.min.js');
GS._ = require('./third/lodash-min.js');
GS.poao = require('./third/pako.min.js');
GS.GSDate = require('./code/GSDate');

GS.event = EventListener({});

cc.log('load GS end');
