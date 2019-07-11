
class debug{
  static log(...args)
  {
    if(debug.isEnabled === true)
    {
      console.log(...args);
    }
  }
  static setIsEnabled(state)
  {
    debug.isEnabled = state;
  }
}
debug.isEnabled = false;


module.exports = debug;