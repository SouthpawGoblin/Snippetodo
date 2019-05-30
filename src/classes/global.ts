import Lokijs from 'lokijs';
import { Clipboard } from 'electron';

export default interface STGlobal extends NodeJS.Global {
  db: Lokijs | null;
  clipboard: Clipboard;
}
