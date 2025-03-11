import ssl
from django.core.mail.backends.smtp import EmailBackend


class NoSSLvEmailBackend(EmailBackend):
    def open(self):
        if self.connection:
            return False
        try:
            self.connection = self.connection_class(self.host, self.port, timeout=self.timeout)
            if self.use_tls:
                context = ssl._create_unverified_context()
                self.connection.starttls(context=context)
            if self.username and self.password:
                self.connection.login(self.username, self.password)
        except Exception as e:
            if not self.fail_silently:
                raise e
            return False
        return True
