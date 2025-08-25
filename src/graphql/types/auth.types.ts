// Login types
export interface LoginInput {
    loginIdentifier: string;
    password: string;
}

export interface LoginResponse {
    login: { id: string; username: string; email: string; role: string; token: string }
}


// Signup types
export interface SignupInput {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface SignupResponse {
    signup: {
        message: string;
        success: boolean;
    };
}


export interface VerifyEmailOtpResponse {
    verifyEmailOtp: {
        name: string;
        username: string;
        email: string;
    };
}

export interface VerifyEmailOtpInput {
    email: string;
    otp: string;
}


