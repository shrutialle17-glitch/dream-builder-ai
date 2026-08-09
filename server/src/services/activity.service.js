import prisma from '../lib/prisma.js';

export const getActivities = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { userId },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { name: true }
        }
      }
    }),
    prisma.activityLog.count({ where: { userId } })
  ]);
  
  return { activities, total, page: Number(page), limit: Number(limit) };
};
