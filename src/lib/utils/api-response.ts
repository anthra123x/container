import { NextResponse } from "next/server"

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function unauthorizedResponse() {
  return errorResponse("No autorizado", 401)
}

export function notFoundResponse(resource = "Recurso") {
  return errorResponse(`${resource} no encontrado`, 404)
}

export function validationErrorResponse(errors: Record<string, string[]>) {
  return NextResponse.json({ success: false, errors }, { status: 422 })
}
