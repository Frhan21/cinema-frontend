import { Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <Container maxWidth="sm" className="grid min-h-[70vh] place-items-center text-center"><div><p className="eyebrow text-primary">404 · Lost scene</p><h1 className="mt-3 font-display text-5xl font-extrabold">This screening does not exist.</h1><Button component={Link} to="/" variant="contained" className="!mt-8">Return home</Button></div></Container>
}
