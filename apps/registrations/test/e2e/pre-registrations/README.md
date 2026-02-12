## e2e tests

### usage

We use the e2e (end-to-end) tests to ensure that full scenarios work as intended all along the way, from the creation of a pre-registration to the completion of the operation the scenario is testing, or to the error the scenario is expecting. All calls are done via HTTP, with a real test mongoDB database mounted on the other side, so that it reflects reality in the most accurate way possible.

### Structure

The e2e tests MUST be always organized in the same way :
1. Make a set of requests on the HTTP API. Some requests MAY use data from the previous responses.
2. Check the response code and the response body to ensure the response is correctly formatted.
3. Check if the side effects (eg. "a document has been created in the database") has been correctly done.

That is a classic "set, act, check" structure : we first set needed parameters, then act (calling the API), then check the results and side effects.