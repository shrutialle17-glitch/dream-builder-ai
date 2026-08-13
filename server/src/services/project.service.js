import prisma from '../lib/prisma.js';

export const getProjects = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      skip,
      take: Number(limit),
      orderBy: { updatedAt: 'desc' },
      include: {
        startupOverview: { select: { id: true } },
        ideaValidation: { select: { status: true } },
        startupDNA: { select: { status: true } },
        businessPlan: { select: { id: true } },
        mvpPlan: { select: { id: true } },
        branding: { select: { id: true } },
        pitchDeck: { select: { id: true } },
        digitalTwin: { select: { id: true } },
        marketResearch: { select: { id: true } }
      }
    }),
    prisma.project.count({ where: { userId } })
  ]);
  
  return { projects, total, page: Number(page), limit: Number(limit) };
};

export const getProjectById = async (id, userId) => {
  const project = await prisma.project.findUnique({ where: { id } });
  
  if (!project || project.userId !== userId) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }
  return project;
};

export const createProject = async (userId, data) => {
  const project = await prisma.project.create({
    data: { ...data, userId }
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'PROJECT_CREATED',
      entityType: 'PROJECT',
      entityId: project.id,
      details: `Created project: ${project.name}`,
    }
  });

  return project;
};

export const updateProject = async (id, userId, data) => {
  await getProjectById(id, userId); // Ownership check

  const updatedProject = await prisma.project.update({
    where: { id },
    data
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'PROJECT_UPDATED',
      entityType: 'PROJECT',
      entityId: id,
      details: `Updated project: ${updatedProject.name}`,
    }
  });

  return updatedProject;
};

export const deleteProject = async (id, userId) => {
  const project = await getProjectById(id, userId); // Ownership check

  const deletedProject = await prisma.project.delete({
    where: { id }
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'PROJECT_DELETED',
      entityType: 'PROJECT',
      entityId: null, // Set to null because the project no longer exists in the DB (prevents Foreign Key crash)
      details: `Deleted project: ${project.name}`,
    }
  });

  return deletedProject;
};
