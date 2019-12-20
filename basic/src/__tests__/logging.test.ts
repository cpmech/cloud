import { setMlog, setElog, setElogPrefix, mlog, elog } from '../logging';

describe('logging', () => {
  describe('mlog', () => {
    it('should write to the terminal when verbose is on', () => {
      setMlog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      mlog('just testing');
      expect(spy).toHaveBeenCalledWith('just testing');
      spy.mockRestore();
    });

    it('should not write to the terminal when verbose is false', () => {
      setMlog(false);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      mlog('just testing');
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should handle numbers', () => {
      setMlog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      mlog(123);
      expect(spy).toHaveBeenCalledWith(123);
      spy.mockRestore();
    });

    it('should handle booleans', () => {
      setMlog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      mlog(true);
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockRestore();
    });

    it('should handle objects and arrays', () => {
      setMlog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      mlog({
        my: 'object',
        with: 'fields',
        and: ['more'],
      });
      expect(spy).toHaveBeenCalledWith(`{
  \"my\": \"object\",
  \"with\": \"fields\",
  \"and\": [
    \"more\"
  ]
}`);
      spy.mockRestore();
    });
  });

  describe('elog', () => {
    it('should write to the terminal when verbose is on', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog({ customError: 'my custom error message' });
      const correct = `[ERROR]
{
  \"customError\": \"my custom error message\"
}`;
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should write to the terminal when verbose is on (with error.message)', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog({ message: 'now with error message' });
      const correct = '[ERROR] now with error message';
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should not write to the terminal when verbose is false', () => {
      setElog(false);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog({ customError: 'my custom error message' });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
      expect(res).toBe(`[ERROR]
{
  \"customError\": \"my custom error message\"
}`);
    });

    it('should handle duplicate [ERROR] prefixes', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog('[ERROR] my error');
      const correct = '[ERROR] my error';
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should use different prefix', () => {
      setElog(true);
      setElogPrefix('>>>error<<<');
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog('my error');
      setElogPrefix('[ERROR]');
      const correct = '>>>error<<< my error';
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should handle strings', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog('my error');
      const correct = '[ERROR] my error';
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should handle numbers', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog(666);
      const correct = '[ERROR] 666';
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should handle booleans', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog(false);
      const correct = '[ERROR] false';
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });

    it('should handle objects', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog({ all: 'wrong', here: 'unfortunately' });
      const correct = `[ERROR]
{
  \"all\": \"wrong\",
  \"here\": \"unfortunately\"
}`;
      expect(spy).toHaveBeenCalledWith(correct);
      spy.mockRestore();
      expect(res).toBe(correct);
    });
  });
});
