import {expect} from "../../snowpack/pkg/chai.js";
export async function expectAsyncErrorThrow(method) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an("Error");
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiL2hvbWUvcnVubmVyL3dvcmsvcHJpY2UtY2FsY3VsYXRvci9wcmljZS1jYWxjdWxhdG9yL3NyYy91dGlscy90ZXN0X2hlbHBlcnMudHMiXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUdBLDRDQUE0QyxRQUErQztBQUMxRixNQUFJLFFBQXVCO0FBQzNCLE1BQUk7QUFDSCxVQUFNO0FBQUEsV0FDRSxLQUFQO0FBQ0QsWUFBUTtBQUFBO0FBRVQsU0FBTyxPQUFPLEdBQUcsR0FBRyxHQUFHO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
