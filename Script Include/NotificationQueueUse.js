gs.info("Running Scheduled Job - Q2H Notifications");

var queue = new scope.NotificationQueueUtil();

queue.dequeue("scope.n1", "t4");
queue.dequeue("scope.n2", "t5");

var _arrayUtil = new global.ArrayUtil();
var queue = new scope.NotificationQueueUtil();

var currentL = current.getValue("l4");
var currentLArr = gs.nil(currentL) ? [] : currentL.split(",");

var prevL = previous.getValue("l4");
var prevLArr = gs.nil(prevL) ? [] : prevL.split(",");

var level4AddedArr = _arrayUtil.diff(currentLArr, prevLArr);
var level4RemovedArr = _arrayUtil.diff(prevLArr, currentLArr);

queue.enqueue("t5", {
    event_name: "scope.n3",
    t5: current.getUniqueValue(),
    l_added: lAddedArr.join(),
    l_removed: lRemovedArr.join()
});

gs.info("Completed Scheduled Job - Q2H Notifications");