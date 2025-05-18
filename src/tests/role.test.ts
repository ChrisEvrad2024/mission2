import request from 'supertest';
import app from '../index';
import { Role } from '../models/Role';

describe('Role Management', () => {
  test('Default roles should exist', async () => {
    const roles = await Role.findAll();
    expect(roles.length).toBeGreaterThanOrEqual(3);
    
    const roleNames = roles.map(r => r.name);
    expect(roleNames).toContain('super_admin');
    expect(roleNames).toContain('encadreur');
    expect(roleNames).toContain('etudiant');
  });

  test('Super Admin should have full permissions', async () => {
    const superAdmin = await Role.findOne({ where: { name: 'super_admin' });
    expect(superAdmin).not.toBeNull();
    
    const permissions = superAdmin?.permissions;
    expect(permissions?.users?.create).toBe(true);
    expect(permissions?.users?.delete).toBe(true);
    expect(permissions?.settings?.update).toBe(true);
  });
});
