'use client';

/**
 * Barrel file for Firebase functionality.
 * Exports core hooks, providers, and initialization logic.
 */

export * from './setup';
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
