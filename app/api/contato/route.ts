import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY não encontrada em process.env');
      return NextResponse.json(
        { error: 'RESEND_API_KEY não configurada no servidor.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['cauanmoreirasilva6@gmail.com'],
      subject: `Nova Mensagem do Portfólio de ${name}`,
      reply_to: email,
      html: `
        <h1>Nova mensagem recebida do seu portfólio!</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message ?? 'Erro ao enviar e-mail', code: error.name ?? 'unknown' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso!', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Internal error:', error);
    return NextResponse.json(
      {
        error: 'Ocorreu um erro interno no servidor.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
