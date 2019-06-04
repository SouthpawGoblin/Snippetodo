import Lokijs from 'lokijs';
import { Clipboard } from 'electron';

export default interface MyGlobal extends NodeJS.Global {
  db: Lokijs | null;
  clipboard: Clipboard;
}
