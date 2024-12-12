const globalConstants = require('../const/globalConst');

function hasPassedThreshold(date) {
    const thresholdDays = parseInt(globalConstants.EXPIRATION_PROFESIONAL);
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);
  
    return date < thresholdDate;
}


module.exports = { hasPassedThreshold }