import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem'
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				love: {
					50: '#fff1f2',
					100: '#ffe4e6',
					200: '#fecdd3',
					300: '#fda4af',
					400: '#fb7185',
					500: '#f43f5e',
					600: '#e11d48',
					700: '#be123c',
					800: '#9f1239',
					900: '#881337',
					950: '#4c0519',
				},
				passion: {
					50: '#fdf2f8',
					100: '#fce7f3',
					200: '#fbcfe8',
					300: '#f9a8d4',
					400: '#f472b6',
					500: '#ec4899',
					600: '#db2777',
					700: '#be185d',
					800: '#9d174d',
					900: '#831843',
					950: '#500724',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-heart': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.15)' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'slide-up-fade': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'sparkle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5', transform: 'scale(0.95) rotate(3deg)' },
				},
				'soft-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' },
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(244, 63, 94, 0.3)' },
					'50%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.6)' },
				},
				'gentle-wiggle': {
					'0%, 100%': { transform: 'rotate(-1deg)' },
					'50%': { transform: 'rotate(1deg)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-heart': 'pulse-heart 1.5s infinite ease-in-out',
				'float': 'float 3s infinite ease-in-out',
				'slide-up-fade': 'slide-up-fade 0.4s ease-out',
				'sparkle': 'sparkle 2s infinite ease-in-out',
				'soft-bounce': 'soft-bounce 2s infinite ease-in-out',
				'glow': 'glow 2s infinite ease-in-out',
				'gentle-wiggle': 'gentle-wiggle 2s infinite ease-in-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
			},
			fontFamily: {
				display: ['Playfair Display', 'serif'],
				sans: ['Inter', 'sans-serif'],
			},
			backgroundImage: {
				'gradient-love': 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
				'subtle-gradient': 'linear-gradient(120deg, #f9f9f9, #ffffff, #f8f8f8)',
				'passion-gradient': 'linear-gradient(135deg, #ec4899 0%, #be123c 100%)',
			},
			boxShadow: {
				'soft': '0 4px 15px rgba(0, 0, 0, 0.05)',
				'hover': '0 8px 25px rgba(0, 0, 0, 0.1)',
				'love': '0 4px 15px rgba(244, 63, 94, 0.15)',
				'card': '0 2px 10px rgba(0, 0, 0, 0.03), 0 6px 20px rgba(0, 0, 0, 0.02)',
			},
			transitionDuration: {
				'2000': '2000ms',
			},
			screens: {
				'xs': '390px',
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
