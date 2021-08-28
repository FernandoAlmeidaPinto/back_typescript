import path from "path"

export const replaceDir = (nome: string, pasta: string) : string => {
    if (process.platform.includes('win')) {
      var fatiado = __dirname.split('\\')
      fatiado = ['\\'].concat(fatiado)
    } else {
      var fatiado = __dirname.split('/')
      fatiado = ['/'].concat(fatiado)
    }
    const index = fatiado.length - fatiado.indexOf('app') + 1
    return path.join.apply(null, fatiado.slice(0,-index).concat(['uploads', pasta, nome]))
  }