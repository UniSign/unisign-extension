# UniSign Sign Library


## Development

For normal development, just need to run the scripts below:

- `npm run dev`, start webpack to continuously build source codes.
- `npm run test`, run unit tests in `test/` directory.

If you want to test the compatibility in browser environment, you need **enter** `examples/` directory, and run the scripts below:

- `npm run dev`, start a vite development server, and load the bundled file from `dist/` directory.


## Dependencies

### Import for browserify node modules

- `stream-browserify`, is dependant of `cipher-base` module;
- `buffer`, is dependant of lots of dependencies;
