
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
			padding: '2rem',
			screens: {
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
				nebula: {
					purple: "#8A65DF",
					blue: "#5B9DF1",
					dark: "#121212",
					light: "#F8F9FA",
					gray: "#2A2A2A"
				},
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
				'twinkle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'marquee': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.7' },
					'50%': { opacity: '0.3' }
				},
				'nebulaPulse': {
					'0%': { transform: 'scale(1.0)', opacity: '0.7' },
					'50%': { transform: 'scale(1.05)', opacity: '0.9' },
					'100%': { transform: 'scale(1.0)', opacity: '0.7' }
				},
				'nebulaMove': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' }
				},
				'sunPulse': {
					'0%': { opacity: '0.2' },
					'50%': { opacity: '0.3' },
					'100%': { opacity: '0.2' }
				},
				'lightRays': {
					'0%': { opacity: '0.05' },
					'50%': { opacity: '0.15' },
					'100%': { opacity: '0.05' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'twinkle-1': 'twinkle 2s ease-in-out infinite',
				'twinkle-2': 'twinkle 3s ease-in-out infinite 0.5s',
				'twinkle-3': 'twinkle 4s ease-in-out infinite 1s',
				'marquee': 'marquee 15s linear infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
