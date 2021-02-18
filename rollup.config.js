export default [
    {
      input: 'main.js',
      output: { file: 'bundle.cjs.js', format: 'cjs' }
    },
    {
      input: 'main.js',
      watch: false,
      output: { file: 'bundle.es.js', format: 'es' }
    }
  ]