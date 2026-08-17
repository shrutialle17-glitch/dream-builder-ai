import prisma from '../lib/prisma.js';

export const createDigitalTwin = async (userId, data) => {
  const { projectId, ...twinData } = data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== userId) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const existingTwin = await prisma.digitalTwin.findUnique({
    where: { projectId },
  });

  if (existingTwin) {
    const error = new Error('Digital Twin already exists for this project');
    error.statusCode = 409;
    throw error;
  }

  const digitalTwin = await prisma.digitalTwin.create({
    data: {
      projectId,
      ...twinData,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId,
      action: 'DIGITAL_TWIN_CREATED',
      entityType: 'DIGITAL_TWIN',
      entityId: digitalTwin.id,
      details: `Created Digital Twin for project: ${project.name}`,
    },
  });

  return digitalTwin;
};

export const getDigitalTwinByProjectId = async (projectId, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== userId) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const digitalTwin = await prisma.digitalTwin.findUnique({
    where: { projectId },
  });

  if (!digitalTwin) {
    const error = new Error('Digital Twin not found');
    error.statusCode = 404;
    throw error;
  }

  return digitalTwin;
};