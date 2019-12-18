import { setMlog, setElog, mlog, elog } from '../logging';

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
  });

  describe('elog', () => {
    it('should write to the terminal when verbose is on', () => {
      setElog(true);
      const spy = jest.spyOn(global.console, 'log').mockImplementation();
      const res = elog({ customError: 'my custom error message' });
      const correct =
        '[ERROR] ' + JSON.stringify({ customError: 'my custom error message' }, undefined, 2);
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
      expect(res).toBe(
        '[ERROR] ' + JSON.stringify({ customError: 'my custom error message' }, undefined, 2),
      );
    });
  });
});
