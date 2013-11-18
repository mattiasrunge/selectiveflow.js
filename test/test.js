
var assert = require("assert");

suite("selectiveflow", function()
{
  var _selectiveflow = require("../selectiveflow");

  suite("Test flows", function()
  {
    test("A simple flow", function(done)
    {
      var flow = new _selectiveflow();
      var calledSteps = [];
      
      var firstEvent = { type: "StartEvent", id: 1 };
      var secondEvent = { type: "NextEvent", list: [ 1, 2 ] };
      
      flow.addStep("first", [ { type: "StartEvent" } ]);
      flow.addStep("second", [ { type: "NextEvent" } ], true);
      
      flow.addStepCallback("first", function(stepName, events)
      {
        calledSteps.push(stepName);
        
        assert.equal(events.length, 1);
        assert.deepEqual(firstEvent, events[0]);
        
        flow.handleEvent(secondEvent);
        
        flow.resetStep("second");
        flow.addCriteria("second", { list: { $in: events[0].id } });
        
        flow.handleEvent(secondEvent);
      });
      
      flow.addStepCallback("second", function(stepName, events)
      {
        calledSteps.push(stepName);

        assert.equal(events.length, 1);
        assert.deepEqual(secondEvent, events[0]);
        
        assert.deepEqual(calledSteps, [ "first", "second" ]);
        
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