import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Patient } from '../services/types'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MoreVertical } from 'lucide-react'
import { toast } from 'sonner'
import { DatePicker } from './ui/date-picker'

interface PatientCardProps {
  patient: Patient
  onPatientUpdate: (patient: Patient) => void
  onPatientDelete: (patient: Patient) => void
}

const PatientCard = ({
  patient,
  onPatientUpdate,
  onPatientDelete,
}: PatientCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedPatient, setEditedPatient] = useState<Patient>(patient)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put<Patient>(
        `/${user?.id}/patients/${patient.id}`,
        editedPatient,
      )

      onPatientUpdate(editedPatient)

      toast.success('Paciente editado com sucesso')
    } catch (err) {
      console.log(err)
      toast.error('Erro ao editar paciente. Por favor, tente novamente')
    }
    setIsEditModalOpen(false)
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/${user?.id}/patients/${patient.id}`)
      onPatientDelete(patient)
      toast.success('Paciente deletado com sucesso')
    } catch (err) {
      console.log(err)
      toast.error('Erro ao deletar paciente. Por favor, tente novamente')
    }
    setIsDeleteDialogOpen(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Patient,
  ) => {
    setEditedPatient((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  function formatDateForRendering(dateString: string) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }

  function formatCPF(cpf: string) {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date instanceof Date) {
      setEditedPatient((prevState) => ({
        ...prevState,
        birthDate: date.toString(),
      }))
    }
  }

  return (
    <>
      <Card className="w-fit">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{patient.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  Excluir
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate(`/patient/${patient.id}`)}
                >
                  Ver mais
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">CPF:</span>{' '}
              {formatCPF(patient.cpf)}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Data de Nascimento:</span>{' '}
              {formatDateForRendering(patient.birthDate)}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Nome da Mãe:</span>{' '}
              {patient.motherName}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editedPatient.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formatCPF(editedPatient.cpf)}
                  onChange={(e) => handleInputChange(e, 'cpf')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <DatePicker
                  value={new Date(editedPatient.birthDate)}
                  onChange={handleDateChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Nome da Mãe</Label>
                <Input
                  id="motherName"
                  value={editedPatient.motherName}
                  onChange={(e) => handleInputChange(e, 'motherName')}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                type="button"
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir paciente</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o paciente?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PatientCard
