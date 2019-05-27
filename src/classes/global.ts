import Lokijs from 'lokijs';

export default interface STGlobal extends NodeJS.Global {
  db: Lokijs | null;
}
