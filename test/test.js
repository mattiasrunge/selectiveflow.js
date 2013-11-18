
var assert = require("assert");

suite("selectiveflow", function()
{
  var _selectiveflow = require("../index");

  suite("Test flows", function()
  {
    test("A simple flow", function(done)
    {
      var flow = new _selectiveflow();
      var callCount = 0;
      
      var firstEvent = { type: "StartEvent", id: 1 };
      var secondEvent = { type: "NextEvent", list: [ 1, 2 ] };
      
      flow.addStep("first", [ { type: "StartEvent" } ]);
      flow.addStep("second", [ { type: "NextEvent" } ]);
      
      flow.addCriteria("second", { dummy: false });
      
      flow.addStepCallback("first", function(stepName, events)
      {
        callCount++;
        
        assert.equal(events.length, 1);
        assert.deepEqual(firstEvent, events[0]);
        
        flow.resetStep("second");
        flow.addCriteria("second", { list: { $in: events[0].id } });
        
        flow.handleEvent(secondEvent);
      });
      
      flow.addStepCallback("second", function(stepName, events)
      {
        callCount++;
        
        assert.equal(events.length, 1);
        assert.deepEqual(secondEvent, events[0]);
        
        assert.equal(callCount, 2);
        
        done();
      });
      
      flow.handleEvent(firstEvent);
    });

    test("Flow with more then one level data", function(done)
    {
      var flow = new _selectiveflow();
      
      var firstEvent = { type: { name: "StartEvent" }, id: 1 };
      var secondEvent = { type: "NextEvent", list: [ 1, 2 ] };
      
      
      flow.addStep("first", [ { "type.name": "StartEvent", id: 1 } ]);
      flow.addStep("second", [ { type: "NextEvent" } ]);
      
      flow.addCriteria("second", { dummy: false });
      
      flow.addStepCallback("first", function(stepName, events)
      {
        assert.equal(events.length, 1);
        assert.deepEqual(firstEvent, events[0]);
        
        flow.resetStep("second");
        flow.addCriteria("second", { list: { $in: events[0].id } });
        
        flow.handleEvent(secondEvent);
      });
      
      flow.addStepCallback("second", function(stepName, events)
      {
        assert.equal(events.length, 1);
        assert.deepEqual(secondEvent, events[0]);
        
        done();
      });
      
      flow.handleEvent(firstEvent);
      
    });
  });
});