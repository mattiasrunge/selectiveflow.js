
(function(factory)
{
  if (typeof define === "function" && define.amd)
  {
    define(["queryEngine"], factory);
  }
  else
  {
    module.exports = factory(require("./query-engine"));
  }
})(function(QueryEngine)
{
  SelectiveFlow = function()
  {
    var self = this;
    
    self.steps = {};
    
    self.addStep = function(name, permanentCriteria, customCriteriaRequired)
    {
      var step = {};
      
      step.permanentCriteria = permanentCriteria || [];
      step.customCriteriaRequired = customCriteriaRequired || false;
      step.callbacks = [];
      step.name = name;
      step.criteria = [];
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
    
    self.resetStep = function(stepName)
    {
      self.steps[stepName].criteria = [];
      
      if (self.steps[stepName].events.length > 0)
      {
        self.steps[stepName].events = [];
        self._triggerStep(stepName);
      }
    };
    
    self.reset = function()
    {
      for (var name in self.steps)
      {
        self.resetStep(name);
      }
    };
    
    self.handleEvent = function(event)
    {
      for (var name in self.steps)
      {
        if (self._matchesCriteria(name, event))
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
    
    self._matchesCriteria = function(stepName, event)
    {
      if (self.steps[stepName].criteria.length === 0 && self.steps[stepName].customCriteriaRequired)
      {
        return false;
      }
      
      var criteria = [].concat(self.steps[stepName].permanentCriteria, self.steps[stepName].criteria);
      
      var models = [ event ];
      var criteriaCollection = new QueryEngine.Criteria({ queries: criteria });
      var passedModels = criteriaCollection.testModels(models);

      return passedModels.length > 0;
    };
  };
  
  return SelectiveFlow;
});
