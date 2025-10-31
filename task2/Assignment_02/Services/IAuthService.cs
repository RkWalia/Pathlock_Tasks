using Assignment_02.DTOs;

namespace Assignment_02.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> Register(RegisterDto dto);
        Task<AuthResponseDto?> Login(LoginDto dto);
    }
}