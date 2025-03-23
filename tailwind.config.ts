
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
				// Custom colors for our app
				"todo-cream": "#FEF7E4",
				"todo-peach": "#FEC5A1",
				"todo-blue": "#D3E4FD",
				"todo-green": "#E6EFE9",
				"todo-pink": "#FFDEE2",
				"todo-gray": "#F1F0FB",
				"todo-text": "#4A4A4A",
				"priority-high": "#F87171",
				"priority-medium": "#FBBF24",
				"priority-low": "#60A5FA",
				"category-work": "#8B5CF6",
				"category-personal": "#EC4899",
				"category-health": "#10B981",
				"category-shopping": "#F59E0B",
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
			fontFamily: {
				'handwritten': ['"Caveat"', 'cursive'],
				'handnote': ['"Kalam"', 'cursive'],
				'sans': ['"DM Sans"', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'slide-down': {
					'0%': { opacity: '0', transform: 'translateY(-10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'checkbox-pop': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.2)' },
					'100%': { transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-in-right': 'fade-in-right 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'checkbox-pop': 'checkbox-pop 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundImage: {
				'paper-texture': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIiB4PSIwIiB5PSIwIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJzb2Z0LWxpZ2h0IiBpbjI9IkJhY2tncm91bmRJbWFnZSIgcmVzdWx0PSJub2lzZSIgLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA3Ii8+Cjwvc3ZnPg==')",
			},
			boxShadow: {
				'paper': '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
				'paper-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12)',
				'glass': '0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		plugin(function({ addUtilities }) {
			const newUtilities = {
				'.text-shadow-sm': {
					textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
				},
				'.text-shadow': {
					textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
				},
				'.bg-glass': {
					backgroundColor: 'rgba(255, 255, 255, 0.6)',
					backdropFilter: 'blur(10px)',
					WebkitBackdropFilter: 'blur(10px)',
				},
				'.bg-paper': {
					backgroundColor: '#fffdf8',
					backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIiB4PSIwIiB5PSIwIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJzb2Z0LWxpZ2h0IiBpbjI9IkJhY2tncm91bmRJbWFnZSIgcmVzdWx0PSJub2lzZSIgLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA3Ii8+Cjwvc3ZnPg==')",
				},
				'.link-underline': {
					position: 'relative',
					'&::after': {
						content: '""',
						position: 'absolute',
						width: '100%',
						transform: 'scaleX(0)',
						height: '1px',
						bottom: 0,
						left: 0,
						backgroundColor: 'currentColor',
						transformOrigin: 'bottom right',
						transition: 'transform 0.25s ease-out'
					},
					'&:hover::after': {
						transform: 'scaleX(1)',
						transformOrigin: 'bottom left'
					}
				}
			};
			addUtilities(newUtilities);
		})
	],
} satisfies Config;
