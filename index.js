
var queryEngine = require("query-engine");

module.exports = function()
{
  var self = this;
  
  self.steps = {};
  
  self.addStep = function(name, permanentCriteria)
  {
    var step = {};
    
    step.permanentCriteria = permanentCriteria || [];
    step.callbacks = [];
    step.name = name;
    step.criteria = step.permanentCriteria;
    step.events = [];
    
    self.steps[name] = step;
  };
  
  self.addStepCallback = function(stepName, callback)
  {
    self.steps[stepName].callbacks.push(callback);
  };
  
  self.addCriteria = function(stepName, criteria)
  {
    self.steps[stepName].criteria.push(criteria);
  };
  
  self.reset = function()
  {
    for (var name in self.steps)
    {
      self.steps[name].criteria = step.permanentCriteria;
      self.steps[name].events = [];
      self.steps[name]._triggerStep(name);
    }
  };
  
  self.handleEvent = function(event)
  {
    for (var name in self.steps)
    {
      if (self._matchesCriteria(self.steps[name].criteria, event))
      {
        self.steps[name].events.push(event);
        self._triggerStep(name);
      }
    }
  };
  
  self._triggerStep = function(stepName)
  {
    for (var n = 0; n < self.steps[stepName].callbacks.length; n++)
    {
      self.steps[stepName].callbacks[n](stepName, self.steps[stepName].events);
    }
  };
  
  self._matchesCriteria = function(criteria, event)
  {
    if (criteria.length === 0)
    {
      return false;
    }
    
    var documents = new queryEngine.createCollection({ 0: event });
    
    for (var n = 0; n < criteria.length; n++)
    {
      
      var result = documents.findOne(criteria[n]);
      
      if (!result)
      {
        return false
      }
    }
    
    return true;
  };
};
