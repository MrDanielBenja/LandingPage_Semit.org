export async function resolve(specifier, context, next) {
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    try {
      return await next(specifier, context)
    } catch {
      for (const ext of ['.js', '.jsx', '.json']) {
        try {
          return await next(specifier + ext, context)
        } catch {}
      }
      throw new Error('No resuelto: ' + specifier)
    }
  }
  return next(specifier, context)
}
