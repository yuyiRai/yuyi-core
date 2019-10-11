
export type Mod = string | { [key: string]: any };
export type Mods = Mod | Mod[];

const ELEMENT = '__';
const MODS = '--';

function join(name: string, el?: string, symbol?: string): string {
  return el ? name + symbol + el : name;
}

function prefix(name: string, mods: Mods): Mods {
  if (typeof mods === 'string') {
    return join(name, mods, MODS);
  }

  if (Array.isArray(mods)) {
    return mods.map(item => prefix(name, item) as Mod);
  }

  const ret: Mods = {};
  if (mods) {
    Object.keys(mods).forEach(key => {
      ret[name + MODS + key] = mods[key];
    });
  }

  return ret;
}


export function createBEM(name: string) {
  return function (el?: Mods, mods?: Mods): Mods {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }
    el = join(name, el as string, ELEMENT);

    return mods ? [el, prefix(el, mods)] : el;
  };
}

export type BEM = ReturnType<typeof createBEM>;