📱 ReUse – App de Reutilização

📌 Sobre o projeto
O ReUse é um aplicativo mobile desenvolvido em React Native com o objetivo de conectar pessoas para reutilização de itens, reduzindo desperdícios.
Nesta fase, o projeto evoluiu dos wireframes para uma aplicação funcional, com foco em UI/UX e uso de recursos nativos.

🎯 Objetivo da fase
Implementar as telas do app em React Native
Aplicar boas práticas de UI/UX mobile
Utilizar recursos nativos (AsyncStorage e câmera)

📱 Telas desenvolvidas
Apresentação
Login
Home
Publicar Item
Perfil (com logout)

🎨 UI/UX aplicados
Layout responsivo com SafeAreaView
Ajuste de teclado com KeyboardAvoidingView
Componentização (ex: PrimaryButton, Cards)
Navegação com Expo Router
Feedback visual e validações
Modal de confirmação ao sair da publicação

💾 AsyncStorage
Utilizado para persistência de sessão e dados do usuário:

@reuse_logado → estado de login
@reuse_usuario → dados do usuário
@reuse_email e @reuse_lembrar → lembrar login

✔️ Login persistente
✔️ Logout funcional

📸 Câmera
Implementada na tela de Publicar Item, permitindo capturar imagem do produto via:
expo-image-picker

⚙️ Tecnologias
React Native
Expo
Expo Router
AsyncStorage
Expo Image Picker

🔐 Login para teste
Email: teste@reuse.com  
Senha: 123456

🔄 Fluxo
Apresentação → Login → Home → Publicar Item → Perfil (logout)