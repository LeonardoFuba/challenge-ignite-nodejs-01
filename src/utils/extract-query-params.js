export function extractQueryParams(query) {

  return query?.substring(1).split('&').reduce((queryParams, params) => {
    const [key, value] = params.split('=')

    queryParams[key] = value

    return queryParams
  }, {})
}
