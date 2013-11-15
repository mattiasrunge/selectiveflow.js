
var assert = require("assert");

suite("selectiveflow", function()
{
  var _selectiveflow = require("../index");

  suite("Test flows", function()
  {
    test("A simple flow", function(done)
    {
      var flow = new _selectiveflow();
      
      var firstEvent = { type: "StartEvent", id: 1 };
      
      flow.addStep("first", [ { type: "StartEvent" } ]);
      
      flow.addStepCallback("first", function(stepName, events)
      {
        assert.equal(events.length, 1);
        assert.deepEqual(firstEvent, events[0]);
        
        flow.addCriteria("second", { list: { $in: events[0].id } });
        
        
      });
      
      var secondEvent = { type: "NextEvent", list: [ 1, 2 ] };
      
      flow.addStep("second", [ { type: "NextEvent" } ]);
      
      flow.addStepCallback("second", function(stepName, events)
      {
        assert.equal(events.length, 1);
        assert.deepEqual(secondEvent, events[0]);
        
        done();
      });
      
      flow.handleEvent(firstEvent);
      flow.handleEvent(secondEvent);
    });
  });
});