import * as activityService from '../services/activity.service.js';

export const getActivities = async (req, res, next) => {
  try {
    const result = await activityService.getActivities(req.user.id, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
