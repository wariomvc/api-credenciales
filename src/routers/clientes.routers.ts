import { Router } from 'express'

const router = Router()

router.get('/', getAllClientes)
router.get('/:id', getOneCliente)
router.post('/', postCliente)
router.put('/:id', putCliente)
router.delete('/:id', deleteCliente)

module.exports = router
