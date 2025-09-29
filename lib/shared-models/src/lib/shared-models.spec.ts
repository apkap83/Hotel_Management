import { TransportName } from './shared-models';

describe('Shared Models Library', () => {
  describe('TransportName Enum', () => {
    it('should export TransportName enum', () => {
      expect(TransportName).toBeDefined();
      expect(typeof TransportName).toBe('object');
    });

    it('should have correct enum values', () => {
      expect(TransportName.AUTH).toBe('auth');
      expect(TransportName.ACTIONS).toBe('actions');
      expect(TransportName.EVENTS).toBe('events');
      expect(TransportName.ERROR).toBe('error');
      expect(TransportName.COMBINED).toBe('combined');
    });

    it('should have all expected enum keys', () => {
      const expectedKeys = ['AUTH', 'ACTIONS', 'EVENTS', 'ERROR', 'COMBINED'];
      const actualKeys = Object.keys(TransportName).filter(key => isNaN(Number(key)));
      
      expect(actualKeys.sort()).toEqual(expectedKeys.sort());
    });

    it('should have correct number of enum members', () => {
      const enumValues = Object.keys(TransportName).filter(key => isNaN(Number(key)));
      expect(enumValues).toHaveLength(5);
    });

    it('should have string values for all enum members', () => {
      const enumValues = Object.values(TransportName);
      
      enumValues.forEach(value => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have lowercase string values', () => {
      const enumValues = Object.values(TransportName);
      
      enumValues.forEach(value => {
        expect(value).toBe(value.toLowerCase());
        expect(value).toMatch(/^[a-z]+$/); // Only lowercase letters
      });
    });

    it('should be usable in switch statements', () => {
      const testFunction = (transportName: TransportName): string => {
        switch (transportName) {
          case TransportName.AUTH:
            return 'authentication';
          case TransportName.ACTIONS:
            return 'actions';
          case TransportName.EVENTS:
            return 'events';
          case TransportName.ERROR:
            return 'error';
          case TransportName.COMBINED:
            return 'combined';
          default:
            return 'unknown';
        }
      };
      
      expect(testFunction(TransportName.AUTH)).toBe('authentication');
      expect(testFunction(TransportName.ACTIONS)).toBe('actions');
      expect(testFunction(TransportName.EVENTS)).toBe('events');
      expect(testFunction(TransportName.ERROR)).toBe('error');
      expect(testFunction(TransportName.COMBINED)).toBe('combined');
    });

    it('should be usable in object key mapping', () => {
      const transportMapping = {
        [TransportName.AUTH]: 'Authentication logs',
        [TransportName.ACTIONS]: 'Action logs',
        [TransportName.EVENTS]: 'Event logs',
        [TransportName.ERROR]: 'Error logs',
        [TransportName.COMBINED]: 'Combined logs',
      };
      
      expect(transportMapping[TransportName.AUTH]).toBe('Authentication logs');
      expect(transportMapping[TransportName.ACTIONS]).toBe('Action logs');
      expect(transportMapping[TransportName.EVENTS]).toBe('Event logs');
      expect(transportMapping[TransportName.ERROR]).toBe('Error logs');
      expect(transportMapping[TransportName.COMBINED]).toBe('Combined logs');
    });

    it('should maintain enum key-value relationship', () => {
      expect(TransportName['AUTH']).toBe('auth');
      expect(TransportName['ACTIONS']).toBe('actions');
      expect(TransportName['EVENTS']).toBe('events');
      expect(TransportName['ERROR']).toBe('error');
      expect(TransportName['COMBINED']).toBe('combined');
    });

    it('should be iterable over values', () => {
      const transportNames = Object.values(TransportName);
      const expectedValues = ['auth', 'actions', 'events', 'error', 'combined'];
      
      expect(transportNames.sort()).toEqual(expectedValues.sort());
    });

    it('should be iterable over keys', () => {
      const transportKeys = Object.keys(TransportName).filter(key => isNaN(Number(key)));
      const expectedKeys = ['AUTH', 'ACTIONS', 'EVENTS', 'ERROR', 'COMBINED'];
      
      expect(transportKeys.sort()).toEqual(expectedKeys.sort());
    });

    it('should support reverse lookup validation', () => {
      const isValidTransportName = (value: string): value is TransportName => {
        return Object.values(TransportName).includes(value as TransportName);
      };
      
      expect(isValidTransportName('auth')).toBe(true);
      expect(isValidTransportName('actions')).toBe(true);
      expect(isValidTransportName('events')).toBe(true);
      expect(isValidTransportName('error')).toBe(true);
      expect(isValidTransportName('combined')).toBe(true);
      expect(isValidTransportName('invalid')).toBe(false);
      expect(isValidTransportName('')).toBe(false);
      expect(isValidTransportName('AUTH')).toBe(false); // Case sensitive
    });

    it('should have unique values for each enum member', () => {
      const values = Object.values(TransportName);
      const uniqueValues = [...new Set(values)];
      
      expect(values).toHaveLength(uniqueValues.length);
    });

    it('should be compatible with TypeScript strict mode', () => {
      // Test that the enum can be used as a type
      const testFunction = (transport: TransportName): string => {
        return `Transport: ${transport}`;
      };
      
      expect(testFunction(TransportName.AUTH)).toBe('Transport: auth');
      expect(testFunction(TransportName.ACTIONS)).toBe('Transport: actions');
      expect(testFunction(TransportName.EVENTS)).toBe('Transport: events');
      expect(testFunction(TransportName.ERROR)).toBe('Transport: error');
      expect(testFunction(TransportName.COMBINED)).toBe('Transport: combined');
    });

    it('should support array operations', () => {
      const allTransports = Object.values(TransportName);
      
      expect(allTransports.includes(TransportName.AUTH)).toBe(true);
      expect(allTransports.includes('invalid' as any)).toBe(false);
      
      const filteredTransports = allTransports.filter(t => t !== TransportName.ERROR);
      expect(filteredTransports).toHaveLength(4);
      expect(filteredTransports).not.toContain(TransportName.ERROR);
    });

    it('should maintain consistency across imports', () => {
      // Test re-importing to ensure consistency
      const { TransportName: ReimportedTransportName } = require('./shared-models');
      
      expect(ReimportedTransportName).toBe(TransportName);
      expect(ReimportedTransportName.AUTH).toBe(TransportName.AUTH);
      expect(ReimportedTransportName.ACTIONS).toBe(TransportName.ACTIONS);
      expect(ReimportedTransportName.EVENTS).toBe(TransportName.EVENTS);
      expect(ReimportedTransportName.ERROR).toBe(TransportName.ERROR);
      expect(ReimportedTransportName.COMBINED).toBe(TransportName.COMBINED);
    });
  });

  describe('Module Exports', () => {
    it('should export TransportName from the main module file', () => {
      const mainExports = require('./shared-models');
      
      expect(mainExports.TransportName).toBeDefined();
      expect(mainExports.TransportName).toBe(TransportName);
    });

    it('should export TransportName from the index file', () => {
      const indexExports = require('../index');
      
      expect(indexExports.TransportName).toBeDefined();
      expect(indexExports.TransportName).toBe(TransportName);
    });

    it('should have consistent exports between files', () => {
      const mainExports = require('./shared-models');
      const indexExports = require('../index');
      
      expect(Object.keys(mainExports).sort()).toEqual(Object.keys(indexExports).sort());
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle enum comparison correctly', () => {
      expect(TransportName.AUTH === 'auth').toBe(true);
      expect(TransportName.AUTH === TransportName.AUTH).toBe(true);
      expect(TransportName.AUTH !== TransportName.ACTIONS).toBe(true);
      expect(TransportName.AUTH !== 'AUTH').toBe(true); // Case sensitive
    });

    it('should handle JSON serialization correctly', () => {
      const testObject = {
        transport: TransportName.AUTH,
        message: 'test'
      };
      
      const serialized = JSON.stringify(testObject);
      const deserialized = JSON.parse(serialized);
      
      expect(deserialized.transport).toBe('auth');
      expect(deserialized.transport).toBe(TransportName.AUTH);
    });

    it('should maintain type safety with function parameters', () => {
      const processTransport = (transport: keyof typeof TransportName): string => {
        return TransportName[transport];
      };
      
      expect(processTransport('AUTH')).toBe('auth');
      expect(processTransport('ACTIONS')).toBe('actions');
      expect(processTransport('EVENTS')).toBe('events');
      expect(processTransport('ERROR')).toBe('error');
      expect(processTransport('COMBINED')).toBe('combined');
    });
  });
});
