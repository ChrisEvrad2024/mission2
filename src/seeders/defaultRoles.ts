import { Role } from '../models/Role';

export const seedDefaultRoles = async () => {
  try {
    // Super Admin
    await Role.findOrCreate({
      where: { name: 'super_admin' },
      defaults: {
        name: 'super_admin',
        permissions: {
          users: { create: true, read: true, update: true, delete: true },
          roles: { create: true, read: true, update: true, delete: true },
          settings: { update: true }
        },
        is_default: false
      }
    });

    // Encadreur
    await Role.findOrCreate({
      where: { name: 'encadreur' },
      defaults: {
        name: 'encadreur',
        permissions: {
          projects: { create: true, read: true, update: true, delete: false },
          students: { read: true, update: true },
          documents: { create: true, read: true, update: true, delete: false }
        },
        is_default: false
      }
    });

    // Étudiant
    await Role.findOrCreate({
      where: { name: 'etudiant' },
      defaults: {
        name: 'etudiant',
        permissions: {
          projects: { read: true, update: true },
          documents: { create: true, read: true, update: true, delete: true }
        },
        is_default: true
      }
    });

    console.log('Default roles seeded successfully');
  } catch (error) {
    console.error('Error seeding default roles:', error);
    throw error;
  }
};
