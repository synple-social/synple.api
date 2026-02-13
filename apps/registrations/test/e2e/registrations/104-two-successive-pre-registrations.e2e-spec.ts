/**
 * The flow is :
 * 1. a user creates a pre-registration
 * 2. the user validates the pre-registration correctly, thus creating a registration
 * 3. the user creates another pre-registration with the same email (supposedly closed and reopened the frontend app)
 * 4. the user confirms this second pre-registration
 * 
 * result should be that the first registration is returned on the second call as it is still valid.
 */