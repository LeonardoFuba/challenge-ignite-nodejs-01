export function buildRoutePath(path) {

  //regex para os nomes dos parâmetros
  const routerParametersRegex = /:([a-zA-z]+)/g

  //regex para os valores válidos dos parâmetros no path
  const pathWithParams = path.replaceAll(routerParametersRegex, '(?<$1>[a-z0-9\-_]+)')

  return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
}
