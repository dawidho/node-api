const authenticate = async (req, res, next) => {
  try {
    // Identification: Extract user claim from token
    const token = req.headers.authorization?.split(' ')[1]

    // Authentication: Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request
    req.user = {
      id: decoded.id, // ⬅ Identification
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}
