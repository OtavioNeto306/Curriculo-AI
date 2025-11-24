# Changelog

## 2025-11-23
- Criado componente `LogoutButton.tsx` para permitir que usuários logados façam logout
  - O componente usa `supabase.auth.signOut()` para deslogar o usuário
  - Redireciona para a página inicial após o logout
  - Estilizado com cores vermelhas para indicar ação de saída
  - Pode ser importado e usado em qualquer página que precise de funcionalidade de logout

## Anterioreleased]

### Fixed
- Updated deprecated Groq model `llama3-70b-8192` to `llama-3.3-70b-versatile` in `services/aiService.ts` to resolve API errors.
