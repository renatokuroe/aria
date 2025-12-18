import { Box } from '@chakra-ui/react'

export default function Logo({ size = 'md', variant = 'blue' }: { size?: 'sm' | 'md' | 'lg' | 'xl', variant?: 'blue' | 'white' }) {
    const sizes = {
        sm: { width: '40px', height: 'auto' },
        md: { width: '80px', height: 'auto' },
        lg: { width: '120px', height: 'auto' },
        xl: { width: '240px', height: 'auto' },
    }

    let logoSrc: string

    if (size === 'xl') {
        logoSrc = '/logo-full-green-no-bg.webp'
    } else {
        logoSrc = variant === 'white' ? '/logo-white.png' : '/logo-green-no-bg.webp'
    }

    return (
        <Box
            as="img"
            src={logoSrc}
            alt="Aria"
            {...sizes[size]}
            objectFit="contain"
        />
    )
}
